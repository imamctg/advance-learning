export const metadata = {
  title: 'Terms and Conditions - Advanced Learning',
}

const TermsPage = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6 text-center'>
        Terms and Conditions
      </h1>
      <p className='text-gray-700 leading-relaxed mb-4'>
        By accessing and using this platform, you agree to abide by our terms
        and conditions.
      </p>

      <ul className='list-disc pl-5 text-gray-700 space-y-3'>
        <li>You must be 13 years or older to register on our platform.</li>
        <li>
          All content is for personal learning and cannot be redistributed.
        </li>
        <li>Any violation may result in suspension of your account.</li>
      </ul>
    </div>
  )
}

export default TermsPage
