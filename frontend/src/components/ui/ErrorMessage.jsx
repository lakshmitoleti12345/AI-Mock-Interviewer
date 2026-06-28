export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-center">
      <p className="text-sm text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-red-300 hover:text-red-200"
        >
          Try again
        </button>
      )}
    </div>
  );
}
