<template lang="">
  <nav class= "flex justify-between items-center h-20 mx-20">
       <router-link to="/"><h1 class="font-medium text-3xl">logo</h1></router-link>
    <ul class="flex gap-5">
      <router-link to="/"><li>Home</li></router-link>
      <router-link to="/about"><li>About</li></router-link>
      <router-link to="/contact"><li>Contact</li></router-link>
     </ul>
     <div class="gap-5 flex">
      <router-link to="/login" class="bg-blue-400  rounded-md w-20 h-10 text-center flex justify-center items-center border-2 border-blue-500 hover:bg-white">Login</router-link>
      <router-link to="/register" class="bg-blue-400  rounded-md w-20 h-10 text-center flex justify-center items-center border-2 border-blue-500 hover:bg-white">Register</router-link>
     </div>
  </nav>
</template>
