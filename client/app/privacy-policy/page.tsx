export const metadata = {
  title: 'Privacy Policy - Advanced Learning',
}

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Privacy Policy</h1>
      <p className='text-gray-700 mb-4'>
        Your privacy is important to us. This policy explains what data we
        collect and how we use it.
      </p>

      <ul className='list-disc pl-5 text-gray-700 space-y-3'>
        <li>
          We collect your name, email, and course activity for account
          management.
        </li>
        <li>We do not sell or share your data with third parties.</li>
        <li>
          You can request data deletion at any time by contacting support.
        </li>
      </ul>
    </div>
  )
}

export default PrivacyPolicy
