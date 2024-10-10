export const HelloWorld = () => (
  <div class="min-h-screen min-w-screen flex justify-center items-center">
    <div class="p-20 flex flex-col items-start gap-4 bg-white/60 rounded-md">
      <h1 class="text-4xl">Hello world!</h1>
      <p>{import.meta.env.VITE_SUPABASE_URL}</p>
    </div>
  </div>
);
