// app/contact/page.tsx

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Advanced Learning',
  description: 'Get in touch with the Advanced Learning team.',
}

const ContactPage = () => {
  return (
    <div className='max-w-3xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold text-center mb-6'>Contact Us</h1>

      <p className='text-gray-700 text-lg mb-8 text-center'>
        Have questions? Feel free to reach out to us. We'd love to hear from
        you!
      </p>

      <form className='space-y-6'>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Your Name
          </label>
          <input
            type='text'
            id='name'
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            placeholder='Enter your name'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Your Email
          </label>
          <input
            type='email'
            id='email'
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            placeholder='Enter your email'
          />
        </div>

        <div>
          <label
            htmlFor='message'
            className='block text-sm font-medium text-gray-700'
          >
            Message
          </label>
          <textarea
            id='message'
            rows={5}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            placeholder='Write your message'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md'
        >
          Send Message
        </button>
      </form>
    </div>
  )
}

export default ContactPage
