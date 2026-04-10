const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    const { title, description, category, creditsRequired, duration, location } = req.body;

    const service = new Service({
      title,
      description,
      category,
      creditsRequired,
      duration,
      location,
      providerId: req.user.id,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' }).populate('providerId', 'name email rating');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId', 'name email rating');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
