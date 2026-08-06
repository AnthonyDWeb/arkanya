import type { Metadata } from "next"
// arkanya-slot:contact-form-import

export const metadata: Metadata = {
  title: "Contact",
}

export default function ContactPage() {
  return (
    <main className="py-24 px-6 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <h1
          className="text-4xl font-bold mb-4 text-center"
          style={{ color: "{{primary-color}}" }}
        >
          Contact
        </h1>
        <p className="text-gray-500 text-center mb-10">
          Prenez contact avec nous. Nous vous répondrons dans les meilleurs délais.
        </p>
        {/* arkanya-slot:contact-form-component */}
      </div>
    </main>
  )
}
