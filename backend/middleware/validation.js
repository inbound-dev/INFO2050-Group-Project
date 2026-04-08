const validateApply = (req, res, next) => {
  const { full_name, email, phone, message } = req.body;

  if (!full_name || full_name.length > 50) {
    return res.status(400).json({ message: 'Invalid Name' });
  }
  if (!email || !email.includes("@") || email.length > 100) {
    return res.status(400).json({ message: 'Invalid Email' });
  }
  if (phone && phone.length > 20) {
    return res.status(400).json({ message: "Invalid Phone Number" });
  }
  if (message && message.length > 500) {
    return res.status(400).json({ message: "Message too long" });
  }
  if (req.file) {
    const allowedTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlink(file.path, () => {});
      return res.status(400).json({ message: "Invalid file type" });
    }
    if (req.file.size > maxSize) {
      return res.status(400).json({ message: "File too large" });
    }
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@') || email.length > 100) {
    return res.status(400).json({ message: 'Invalid Email' });
  }
  if ((!password || password.length > 50)) {
    return res.status(400).json({ message: 'Invalid Password' });
  }

  next();
};

const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || name.length > 50) {
    return res.status(400).json({ message: 'Invalid Name' });
  }
  if (!email || !email.includes('@') || email.length > 100) {
    return res.status(400).json({ message: 'Invalid Email' });
  }
  if (!message || message.length > 500) {
    return res.status(400).json({ message: 'Invalid Message' });
  }

  next();
};

module.exports = {
  validateApply,
  validateLogin,
  validateContact,
};