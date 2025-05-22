import React from 'react'
import Signup from "../components/auth/Signup"
import PageTransition from "../components/common/PageTransition"

function SignupPage() {
  return (
    <PageTransition>
      <Signup />
    </PageTransition>
  )
}

export default SignupPage;