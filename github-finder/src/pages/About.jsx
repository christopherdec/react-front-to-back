function About() {
  return (
    <div>
        <h1 className="text-6xl mb-4">GitHub Finder</h1>
        <p className='mb-4 text-2xl font-light'>
            App desenvolvido em React para procurar e detalhar profiles do GitHub.
            É um dos projetos do curso
            <a href='https://www.udemy.com/course/modern-react-front-to-back/'>
            {' '}
            React Front To Back
            </a>{' '}
            , do Udemy, ministrado por
            <strong>
            <a href='https://traversymedia.com'> Brad Traversy</a>
            </strong>
            .
        </p>
        <p className='text-lg text-gray-400'>
            Version <span className='text-white'>1.0.0</span>
        </p>
        <p className='text-lg text-gray-400'>
            Layout By:
            <a className='text-white' href='https://twitter.com/hassibmoddasser'>
                {' '}Hassib Moddasser
            </a>
        </p>
    </div>
  )
}

export default About