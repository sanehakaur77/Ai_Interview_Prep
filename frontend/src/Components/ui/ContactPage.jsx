import React from "react";
import { Video, MessageSquare, MapPin, Mail, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <section
      className="relative min-h-screen px-6 py-20 overflow-hidden bg-white"
      id="contact"
    >
      {/* soft background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[25%] top-[30%] w-[700px] h-[700px] bg-green-50 rounded-full blur-[130px]" />
      </div>

      <div className="grid items-center max-w-6xl gap-12 mx-auto lg:grid-cols-2">
        {/* left side */}
        <div>
          <span className="text-sm font-medium text-green-600">CONTACT US</span>

          <h1 className="mt-3 text-4xl font-bold leading-tight lg:text-6xl">
            Let's talk about your
            <span className="text-green-500"> interview journey.</span>
          </h1>

          <p className="max-w-md mt-6 leading-8 text-slate-600">
            Whether you're preparing for your first interview or polishing your
            skills, we're here to help. Send us a message and our team will get
            back to you soon.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-50">
                <Video size={18} />
              </div>
              <div>
                <p className="font-medium">Book a demo session</p>
                <span className="text-sm text-slate-500">
                  AI guided interview practice
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-50">
                <MessageSquare size={18} />
              </div>

              <div>
                <p className="font-medium">Live support</p>
                <span className="text-sm text-slate-500">
                  Available all week
                </span>
              </div>
            </div>
          </div>

          {/* actual contact details */}
          <div className="pt-8 mt-12 space-y-4 border-t">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={18} />
              support@interviewprep.ai
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={18} />
              +91 98765 43210
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <MapPin size={18} />
              Mohali, Punjab
            </div>
          </div>
        </div>

        {/* right card */}
        <div className="p-8 bg-white border border-slate-100 rounded-3xl">
          <h2 className="text-2xl font-semibold">Send us a message</h2>

          <p className="mt-2 mb-8 text-sm text-slate-500">
            Usually replies within a few hours
          </p>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full name"
              className="w-full p-4 border outline-none rounded-xl focus:border-green-500"
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full p-4 border outline-none rounded-xl focus:border-green-500"
            />

            <textarea
              rows={5}
              placeholder="Tell us how we can help..."
              className="w-full p-4 border outline-none resize-none rounded-xl focus:border-green-500"
            />

            <button className="w-full py-4 font-medium text-white transition bg-green-500 rounded-full hover:bg-green-600">
              Send Message
            </button>

            <p className="text-xs text-center text-slate-400">
              We’ll never share your information.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
