import { useCallback, useEffect, useState } from "react";

// Ejecuta una consulta a la API y entrega sus datos, si está cargando y el error
export function useCarga(consulta, dependencias = []) {
  const [estado, setEstado] = useState({ data: null, cargando: true, error: "" });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let vigente = true;
    setEstado((actual) => ({ ...actual, cargando: true, error: "" }));
    consulta()
      .then((data) => vigente && setEstado({ data, cargando: false, error: "" }))
      .catch((error) => vigente && setEstado({ data: null, cargando: false, error: error.message }));
    return () => { vigente = false; };
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((valor) => valor + 1), []);
  return { ...estado, recargar };
}
