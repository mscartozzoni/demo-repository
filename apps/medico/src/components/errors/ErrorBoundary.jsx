import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Ops! Algo deu errado.</h1>
          <p className="text-slate-400 mb-6 max-w-md">
            Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada. Por favor, tente recarregar a página.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left bg-slate-800 p-4 rounded-md w-full max-w-2xl">
              <summary className="cursor-pointer font-semibold">Detalhes do Erro (Desenvolvimento)</summary>
              <pre className="mt-2 text-sm text-red-400 whitespace-pre-wrap break-all">
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;