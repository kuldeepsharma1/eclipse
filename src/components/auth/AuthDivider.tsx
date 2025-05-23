export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gray-900 px-4 text-gray-400">or continue with</span>
      </div>
    </div>
  );
}
