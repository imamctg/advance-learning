'use client'

import React, { useState } from 'react'
import StudentForm from './StudentForm'
import InstructorForm from './InstructorForm'

type Props = {
  defaultRole: 'student' | 'instructor'
}

const RegistrationForm = ({ defaultRole }: Props) => {
  if (defaultRole === 'student') {
    return <StudentForm />
  } else {
    return <InstructorForm />
  }
}

export default RegistrationForm
