const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://tasniaanwer:medha@cluster0.xcrjgxe.mongodb.net/formcraft';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // Fallback to in-memory storage for development
    console.log('Using in-memory storage as fallback');
  });

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  company: {
    id: String,
    name: String,
    website: String,
    logo: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fields: [{ type: mongoose.Schema.Types.Mixed }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#374151' },
    logo: { type: String },
    companyName: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const formResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  responses: { type: mongoose.Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
});

// Models
const User = mongoose.model('User', userSchema);
const Form = mongoose.model('Form', formSchema);
const FormResponse = mongoose.model('FormResponse', formResponseSchema);

// In-memory fallback storage
let inMemoryUsers = [];
let inMemoryForms = [];
let nextUserId = 1;
let nextFormId = 1;

// Helper functions for in-memory storage
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    return inMemoryUsers.find(user => user.email === email);
  }
};

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    const newUser = {
      _id: `user_${nextUserId++}`,
      ...userData,
      createdAt: new Date(),
    };
    inMemoryUsers.push(newUser);
    return newUser;
  }
};

const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    return inMemoryUsers.find(user => user._id.toString() === id.toString());
  }
};

const createForm = async (formData) => {
  try {
    const form = new Form(formData);
    return await form.save();
  } catch (error) {
    const newForm = {
      _id: `form_${nextFormId++}`,
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryForms.push(newForm);
    return newForm;
  }
};

const findFormsByUserId = async (userId) => {
  try {
    return await Form.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    return inMemoryForms.filter(form => form.userId.toString() === userId.toString());
  }
};

const findFormById = async (id) => {
  try {
    return await Form.findById(id);
  } catch (error) {
    return inMemoryForms.find(form => form._id.toString() === id.toString());
  }
};

const updateForm = async (id, updateData) => {
  try {
    return await Form.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    const formIndex = inMemoryForms.findIndex(form => form._id.toString() === id.toString());
    if (formIndex !== -1) {
      inMemoryForms[formIndex] = { ...inMemoryForms[formIndex], ...updateData, updatedAt: new Date() };
      return inMemoryForms[formIndex];
    }
    return null;
  }
};

const deleteForm = async (id) => {
  try {
    return await Form.findByIdAndDelete(id);
  } catch (error) {
    const formIndex = inMemoryForms.findIndex(form => form._id.toString() === id.toString());
    if (formIndex !== -1) {
      return inMemoryForms.splice(formIndex, 1)[0];
    }
    return null;
  }
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Create token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '24h' });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '24h' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Form Routes
app.get('/api/forms', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const forms = await findFormsByUserId(decoded.userId);

    res.json(forms);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/forms', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const { title, description, fields } = req.body;

    const form = await createForm({
      title,
      description,
      fields,
      userId: decoded.userId,
    });

    res.status(201).json(form);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/forms/:id', async (req, res) => {
  try {
    const form = await findFormById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/forms/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const form = await findFormById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.userId.toString() !== decoded.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedForm = await updateForm(req.params.id, req.body);
    res.json(updatedForm);
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/forms/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const form = await findFormById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.userId.toString() !== decoded.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await deleteForm(req.params.id);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Form submission endpoint
app.post('/api/forms/:id/submit', async (req, res) => {
  try {
    const { formId, responses, submittedAt } = req.body;
    const form = await findFormById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Create form response
    const formResponse = new FormResponse({
      formId: form._id,
      responses,
      submittedAt: submittedAt || new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });

    await formResponse.save();

    res.status(201).json({
      message: 'Form submitted successfully',
      responseId: formResponse._id
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});