export default function Footer() {
  return (
 
<footer class="bg-zinc-50 font-sans dark:bg-gray-900">
    <div class="container px-6 py-2 mx-auto">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            <div class="sm:col-span-2">
                <h1 class="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">Subscribe our newsletter to get an update.</h1>

                <div class="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
                    <input id="email" type="text" class="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" placeholder="Email Address" />
            
                    <button class="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                        Subscribe
                    </button>
                </div>
                <div class="flex gap-4 mt-[15px] ml[15px] hover:cursor-pointer">
                <img src="https://www.svgrepo.com/show/94698/github.svg" class="" width="30" height="30" alt="gt" />
                <img src="https://www.svgrepo.com/show/28145/linkedin.svg" width="30" height="30" alt="in" />   
            </div>
            </div>

            <div>
                <p class="font-semibold text-gray-800 dark:text-white">Quick Link</p>

                <div class="flex flex-col items-start mt-5 space-y-2">
                    <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">Home</p>
                    <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">Who We Are</p>
                    <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">Our Philosophy</p>
                </div>
            </div>

            <div>
                <p class="font-semibold text-gray-800 dark:text-white">Industries</p>

                <div class="flex flex-col items-start mt-5 space-y-2">
                    <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">Retail & E-Commerce</p>
                    <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">Information Technology</p>
                    <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">Finance & Insurance</p>
                </div>
            </div>
        </div>
        
        <hr class="my-2 border-gray-200 md:my-2 dark:border-gray-700 h-2" />
        <p class="font-sans p-8 text-start md:text-center md:text-lg md:p-4">© 2023 PrimePicks Inc. All rights reserved.</p>
    </div>
</footer>
  );
}
