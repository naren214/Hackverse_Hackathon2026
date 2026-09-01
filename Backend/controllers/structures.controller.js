import Structure from '../models/Structure.js';
import PDFDocument from 'pdfkit';

export const getStructures = async (req, res, next) => {
  try {
    const { type, status, city, search } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const structures = await Structure.find(filter).sort({ name: 1 });
    res.json({ success: true, data: structures });
  } catch (error) {
    next(error);
  }
};

export const getStructure = async (req, res, next) => {
  try {
    const structure = await Structure.findById(req.params.id);
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }
    res.json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

export const createStructure = async (req, res, next) => {
  try {
    const structure = await Structure.create(req.body);
    res.status(201).json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

export const updateStructure = async (req, res, next) => {
  try {
    const structure = await Structure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }
    res.json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

export const deleteStructure = async (req, res, next) => {
  try {
    const structure = await Structure.findByIdAndDelete(req.params.id);
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }
    res.json({ success: true, message: 'Structure deleted' });
  } catch (error) {
    next(error);
  }
};


export const exportReport = async (req, res, next) => {
  try {
    const structure = await Structure.findById(req.params.id);
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=structure-report-${structure._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`Infrastructure Report: ${structure.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    doc.text(`Type: ${structure.type}`);
    doc.text(`Status: ${structure.status}`);
    doc.text(`Health Score: ${structure.healthScore}`);
    doc.text(`Material: ${structure.material || 'N/A'}`);
    doc.text(`Build Year: ${structure.buildYear || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(16).text('Current Environmental / Seismic Readings');
    if (global.realInputsCache && global.realInputsCache[structure._id]) {
      const inputs = global.realInputsCache[structure._id];
      if (inputs.weather) {
        doc.fontSize(12).text(`Temperature: ${inputs.weather.temperature}°C`);
        doc.text(`Wind Speed: ${inputs.weather.windSpeed} km/h`);
      }
      if (inputs.seismic) {
        doc.text(`Recent Quake Mag: ${inputs.seismic.magnitude}`);
      }
    } else {
      doc.fontSize(12).text('No recent environmental factors recorded.');
    }
    
    doc.end();
  } catch (error) {
    next(error);
  }
};
