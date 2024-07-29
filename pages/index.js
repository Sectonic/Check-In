import Link from "next/link";

export default function Home() {

  return (
    <>
      <section className="bg-base-100">
          <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto gap-10 lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
              <div className="mr-auto place-self-center lg:col-span-7">
                  <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">Make Attendance <br />Easy.</h1>
                  <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
                    Check-In is a versatile attendance website that provides easy accessibility, immense speed, detailed displays for your needs. It allows you to take attendance in a way you want and is flexibile to your style.
                  </p>
                  <div className="flex justify-start items-start gap-3">
                    <Link href="/preview"><button className="btn btn-primary shadow-md">Preview</button></Link>
                    <Link href="/register"><button className="btn btn-outline btn-primary shadow-md">Register Now</button></Link>
                  </div>
              </div>
              <div className="lg:mt-0 lg:col-span-5 flex justify-center lg:w-full">
                  <img className="w-[300px] lg:w-full" src="/img/hero.png" alt="hero image" />
              </div>                
          </div>
      </section>

      <section className="bg-base-200 rounded-xl">
          <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">

              <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
                    <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-base-content">Take Attendance The Way You Want</h2>
                      <p className="mb-8 font-light lg:text-xl">With Check-In we provide many ways to take attendance. We know that there are many scenarios in which you would want to track therefore we have many options at disposal.</p>

                      <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700">
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Monthly, weekly, or daily reoccuring options</span>
                          </li>
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Non-reoccuring and/or manual tracking</span>
                          </li>
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">QR code attendance</span>
                          </li>
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Form & pincode attendance</span>
                          </li>
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Check-in and check-out customizability</span>
                          </li>
                      </ul>
                      <p className="font-light lg:text-xl">Deliver the most convenient experience with our flexibility</p>
                    </div>
                  <img className="w-3/4 lg:w-full mb-4 rounded-lg lg:mb-0 flex mx-auto" src="https://themewagon.github.io/landwind/images/feature-1.png" alt="dashboard feature image" />
              </div>

              <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
                    <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-base-content">Track And Visualize Your Data</h2>
                      <p className="mb-8 font-light lg:text-xl">No need to keep track of attendance in spreadsheets or any other contraption. Check-In offers detailed and comprehensive data about your attendance sheets.</p>

                      <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7">
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Visualized graphs and charts</span>
                          </li>
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Filterable attendance overviews</span>
                          </li>
                          <li className="flex space-x-3">

                              <svg className="flex-shrink-0 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-base font-medium leading-tight">Key information of attendees</span>
                          </li>
                      </ul>
                    </div>
                  <img className="w-3/4 lg:w-full mb-4 rounded-lg lg:mb-0 flex mx-auto lg:order-first" src="https://themewagon.github.io/landwind/images/feature-2.png" alt="feature image 2" />
              </div>
          </div>
        </section>

      <footer className="bg-base-100">
          <div className="max-w-screen-xl p-4 pb-6 mx-auto lg:pb-16 md:p-8 lg:p-10">
              <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
              <div className="text-center">
                  <a href="#" className="flex items-center justify-center mb-5 text-2xl font-semibold">
                      <img src="/img/logo.png" className="h-5 mr-3 sm:h-9" alt="Check-In Logo" />
                      Check-In 
                  </a>
                  <span className="block text-sm text-center text-gray-500">© 2024 Check-In™. All Rights Reserved.
                  </span>
              </div>
          </div>
      </footer>
    </>
  )
}
