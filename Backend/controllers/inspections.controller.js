import Inspection from '../models/Inspection.js';
import PDFDocument from 'pdfkit';

export const getInspections = async (req, res, next) => {
  try {
    const { structureId, type, compliance } = req.query;
    const filter = {};

    if (structureId) filter.structureId = structureId;
    if (type) filter.type = type;
    if (compliance) filter.compliance = compliance;

    const inspections = await Inspection.find(filter).sort({ date: -1 });
    res.json({ success: true, data: inspections });
  } catch (error) {
    next(error);
  }
};

export const getInspection = async (req, res, next) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }
    res.json({ success: true, data: inspection });
  } catch (error) {
    next(error);
  }
};

export const createInspection = async (req, res, next) => {
  try {
    const inspection = new Inspection(req.body);
    await inspection.save();
    res.status(201).json({ success: true, data: inspection });
  } catch (error) {
    next(error);
  }
};

export const scheduleInspection = async (req, res, next) => {
  try {
    const inspection = new Inspection({
      inspector: 'System / Pending',
      ...req.body,
      status: 'scheduled'
    });
    await inspection.save();

    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      id: `n_${Date.now()}`,
      title: 'Inspection Scheduled',
      message: `An inspection has been scheduled for ${req.body.structureName || 'a structure'} on ${new Date(req.body.date).toLocaleDateString()}.`,
      type: 'info'
    });

    res.status(201).json({ success: true, data: inspection });
  } catch (error) {
    next(error);
  }
};


export const exportPdf = async (req, res, next) => {
  try {
    const { type, compliance } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (compliance && compliance !== 'all') filter.compliance = compliance;

    const inspections = await Inspection.find(filter).sort({ date: -1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=audit-report-${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Audit & Compliance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`);
    doc.text(`Filters -> Type: ${type || 'all'} | Compliance: ${compliance || 'all'}`);
    doc.moveDown();

    inspections.forEach((insp, idx) => {
      doc.fontSize(10).text(`${idx + 1}. Structure: ${insp.structureName}`);
      doc.text(`Date: ${new Date(insp.date).toLocaleDateString()} | Type: ${insp.type} | Status: ${insp.compliance}`);
      doc.text(`Inspector: ${insp.inspector}`);
      if (insp.notes) doc.text(`Notes: ${insp.notes}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};
