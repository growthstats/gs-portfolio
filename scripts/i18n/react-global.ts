// `sanity exec` compiles .tsx with the classic JSX transform, and some schema files use JSX at
// module level (field descriptions), so `React` has to exist as a global before they load.
import React from 'react'

Object.assign(globalThis, { React })
