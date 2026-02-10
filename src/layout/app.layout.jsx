import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../components/header';

const AppLayout = () => {
  return (
    <div>
        <main className='min-h-screen continer'>
          <Header/>
          <Outlet/>
          {/*body */}
        </main>

        {/* About Us */}
        <section className="bg-gray-900 text-gray-300 p-10 mt-10 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            About TinyTRaIL
          </h2>

          <p className="max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-white">TinyTRaIL</span> is a
            mini project URL shortener developed to simplify long URLs into
            short, shareable links. The project demonstrates modern web
            development concepts with a focus on performance, simplicity,
            and usability.
          </p>

          <p className="max-w-3xl mx-auto leading-relaxed mt-3">
            It supports fast redirection, unique link generation, and basic
            tracking, making it suitable for academic evaluation and
            real-world use cases.
          </p>

          {/* Social & Contact Links */}
          <div className="mt-6 flex justify-center gap-6 flex-wrap text-sm">
         

            <a
              href="https://github.com/dhruvsharmads0506/URL_SHORTENER/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-100 transition"
            >
              GitHub
            </a>

            <a
              href="https://linkedin.com/in/dhruvsharma0506"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              LinkedIn
            </a>

            <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dhruvsharma0506@gmail.com"
               target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition"
>
  Email
</a>

          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-400">
            © {new Date().getFullYear()} TinyTRaIL. All rights reserved. |
            <span className="ml-1 underline cursor-pointer">
              Terms & Conditions
            </span>
          </p>
        </section>

        {/*footer */}
        <div className='p-10 text-center bg-gray-800 text-gray-300 mt-10'>
          Made with ❤️ by <span className="font-semibold text-white">TinyTRaIL</span>
        </div>
    </div>
  )
}

export default AppLayout;
