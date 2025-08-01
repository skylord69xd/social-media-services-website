# Social Media Services Website

This is a static website for social media services including account recovery, content removal, and ban services.

## Features

- Services display with platform logos
- Editable Telegram channel link
- Vouches section with image uploads
- Feedback system with admin approval
- Terms & conditions section
- Admin panel for content management
- Responsive design

## Setup Instructions

1. **Download the files**:
   - Clone this repository or download the ZIP file

2. **Add your assets**:
   - Place your logo in `assets/logos/your-logo.png`
   - Add platform logos in `assets/logos/` (facebook.png, instagram.png, etc.)
   - Add payment method icons in `assets/payment/` (btc.png, eth.png, etc.)

3. **Customize content**:
   - Edit `index.html` to update any text content
   - Update colors in `style.css` if desired

4. **Deployment options**:

   ### GitHub Pages (Free)
   1. Create a new GitHub repository
   2. Upload all files
   3. Go to Settings > Pages
   4. Select "main" branch and "/ (root)" folder
   5. Save - your site will be at `https://username.github.io/repository-name`

   ### Netlify (Free)
   1. Drag and drop the folder to Netlify's drop zone
   2. Your site will be deployed instantly

   ### Vercel (Free)
   1. Import the project as a GitHub repository
   2. Deploy with default settings

## Admin Panel Usage

Access the admin panel at `yourdomain.com/admin`

**Functions**:
- Update Telegram channel link
- Add/remove vouches
- Approve/reject feedback

## Notes

- All data is stored in the browser's localStorage
- For persistent storage, consider upgrading to a database solution
- The admin panel requires password protection (configure at hosting level)