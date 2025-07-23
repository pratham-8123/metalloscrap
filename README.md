# Core Metals - React Business Website

A modern, responsive business website built with React for Core Metals, a professional metal services company. The website includes a functional contact form that sends emails using EmailJS.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Navigation**: Smooth scrolling navigation with active state indicators
- **Service Showcase**: Highlighted services with hover effects
- **Contact Form**: Functional contact form with EmailJS integration
- **About Section**: Company information with statistics
- **Professional Footer**: Complete footer with links and company information

## File Structure

```
core-metals/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── BusinessWebsite.js
│   │   └── BusinessWebsite.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- EmailJS account (free tier available)

### Installation

1. Navigate to the project directory:
   ```bash
   cd core-metals
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up EmailJS (see EmailJS Setup section below)

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## EmailJS Setup

The contact form uses EmailJS to send emails directly to your inbox. Follow these steps to set it up:

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Verify your email address

### 2. Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Template Name**: Contact Form Template

**Subject**: New Contact Form Submission from {{from_name}}

**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body>
    <h2>New Contact Form Submission</h2>
    
    <p><strong>Name:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Subject:</strong> {{subject}}</p>
    
    <h3>Message:</h3>
    <p>{{message}}</p>
    
    <hr>
    <p><em>This message was sent from the Core Metals website contact form.</em></p>
</body>
</html>
```

**Important**: Make sure to set the "To Email" field in your template to your email address where you want to receive the form submissions.

4. Save the template and note down your **Template ID**

### 4. Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

### 5. Update the Code
Replace the placeholder values in `src/components/BusinessWebsite.js`:

```javascript
// Line 15: Replace with your EmailJS public key
emailjs.init("YOUR_PUBLIC_KEY");

// Lines 47-48: Replace with your actual IDs
'YOUR_SERVICE_ID', // Your EmailJS service ID
'YOUR_TEMPLATE_ID', // Your EmailJS template ID

// Line 50: Replace with your email address
to_email: 'your-email@example.com', // Your email address

// Line 56: Replace with your EmailJS public key
'YOUR_PUBLIC_KEY' // Your EmailJS public key
```

### Example Configuration:
```javascript
emailjs.init("user_abc123def456");

const result = await emailjs.send(
  'service_xyz789',
  'template_contact_form',
  {
    to_email: 'your-email@gmail.com', // Your email address
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    to_name: 'Core Metals Team'
  },
  'user_abc123def456'
);
```

### Troubleshooting Common Issues:

1. **"The recipients address is empty" Error**:
   - Make sure you've set the "To Email" field in your EmailJS template
   - Ensure the `to_email` parameter is included in the emailjs.send() call
   - Verify your email service is properly connected

2. **Template Variables Not Working**:
   - Make sure template variable names match exactly (case-sensitive)
   - Use double curly braces: `{{variable_name}}`

3. **Service Not Found**:
   - Verify your Service ID is correct
   - Ensure your email service is active in EmailJS dashboard

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

### Components

- **BusinessWebsite.js**: Main component containing the entire website layout
  - Navigation bar with smooth scrolling
  - Hero section with call-to-action
  - Services section with cards
  - About section with company information
  - Contact section with EmailJS integration
  - Footer with links

### Styling

- **BusinessWebsite.css**: Comprehensive CSS with modern design
  - Responsive grid layouts
  - Smooth animations and transitions
  - Professional color scheme
  - Mobile-first responsive design
  - Form submission states and status messages

## Contact Form Features

- **Real-time Validation**: Form fields are validated as users type
- **Loading States**: Button shows "Sending..." during submission
- **Success/Error Messages**: Clear feedback for form submission results
- **Form Reset**: Form clears after successful submission
- **EmailJS Integration**: Sends emails directly to your inbox

## Customization

### Colors
The website uses a professional color palette:
- Primary Blue: `#3498db`
- Dark Blue: `#2c3e50`
- Red Accent: `#e74c3c`
- Light Gray: `#f8f9fa`

### Content
To customize the content:
1. Edit the text content in `BusinessWebsite.js`
2. Update contact information
3. Modify service descriptions
4. Change company statistics

### Styling
To modify the design:
1. Edit `BusinessWebsite.css` for layout and styling changes
2. Update colors in the CSS variables
3. Modify animations and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

To build the project for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to any static hosting service.

## Technologies Used

- React 18.2.0
- Create React App
- EmailJS for contact form functionality
- CSS3 with Grid and Flexbox
- Modern JavaScript (ES6+)

## License

This project is created for demonstration purposes.

## Contact

For questions or support, please contact the development team. 