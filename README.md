
# CliniTrack Frontend (CliniTrack-FE)

CliniTrack is a responsive and scalable medical dashboard system built for clinics and healthcare providers. This is the **frontend** repository of the CliniTrack project, developed using **React.js**, **TypeScript**, and **TailwindCSS**. It provides a clean, modern UI for managing patients, providers, appointments, invoices, and medical records.

## 🔗 Live Demo

[clini-track.ahsanadil.com/](https://clini-track.ahsanadil.com/)

## 🧩 Features

- 🚀 Modern, responsive UI with TailwindCSS  
- 🔐 Secure authentication and authorization  
- 👨‍⚕️ Manage Patients, Providers, Appointments, and Billing  
- 📄 Medical Records and Invoices management  
- 📊 Dashboard overview with analytics  
- 🧭 Sidebar navigation and routing via React Router  
- 🌐 API integration with backend (NestJS)  

## 📁 Folder Structure

```
CliniTrack-FE/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main pages (Dashboard, Patients, etc.)
│   ├── services/           # API service handlers
│   ├── context/            # Global context (Auth, Theme)
│   ├── utils/              # Helper functions
│   └── App.tsx             # Main app setup
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
└── README.md
```

## 🔧 Tech Stack

- **Frontend:** React.js, TypeScript, TailwindCSS  
- **State Management:** Context API  
- **Routing:** React Router DOM  
- **Form Validation:** React Hook Form  
- **API Integration:** Axios  
- **Icons:** Lucide React  

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x  
- npm or yarn  

### Installation

```bash
git clone https://github.com/m-ahsanadil/CliniTrack-FE.git
cd CliniTrack-FE
npm install
# or
yarn install
```

### Run Locally

```bash
npm run dev
# or
yarn dev
```

### Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🧪 Upcoming Features

- Role-based access control  
- Notification system  
- Appointment calendar view  
- Export data to PDF/CSV  

## 🙌 Contributing

Contributions are welcome! Please fork the repo and create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

Then submit a Pull Request for review.

## 🔗 Backend Repository

You can find the backend of this project here:  
👉 [CliniTrack Backend (CliniTrack-BE)](https://github.com/m-ahsanadil/CliniTrack-BE)

## 📧 Contact

**Muhammad Ahsan Adil**  
📧 [muhammadmahsanadil@gmail.com](mailto:muhammadmahsanadil@gmail.com)  
🌐 [ahsanadil.com](https://ahsanadil.com)  
