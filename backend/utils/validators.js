const { z } = require('zod');

const leadSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  companyName: z.string().optional().or(z.literal('')),
  businessType: z.string().optional().or(z.literal('')),
  serviceInterested: z.string().min(1, 'Please select a service'),
  budget: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
});

const validateLead = (data) => {
  return leadSchema.safeParse(data);
};

module.exports = {
  validateLead,
};
