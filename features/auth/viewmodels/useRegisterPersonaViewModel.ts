import { useState, useEffect } from "react";
import { RegisterPersonaService, getTipoDocumentosService } from "../services/RegisterPersonaService";
import { PersonaUserDTO, TipoDocumento } from "../../../shared/interfaces";
import { goToLogin } from "@/navigation/routes";

export const useRegisterPersonaViewModel = () => {
    // ── Campos del formulario ──
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [fechaNac, setFechaNac] = useState("");
    const [numeroDoc, setNumeroDoc] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // ── Combobox tipo documento ──
    const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([]);
    const [tipoDocumentoId, setTipoDocumentoId] = useState<number | null>(null);

    // ── Estado general ──
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carga los tipos de documento al montar la pantalla
    useEffect(() => {
        const cargarTipos = async () => {
            try {
                const tipos = await getTipoDocumentosService();
                setTipoDocumentos(tipos);
                if (tipos.length > 0) setTipoDocumentoId(tipos[0].id); // selecciona el primero por defecto
            } catch (e) {
                console.error("Error cargando tipos de documento", e);
            }
        };
        cargarTipos();
    }, []);

    const onSubmit = async () => {
        // Validación básica
        if (!nombre || !apellidos || !username || !password || !tipoDocumentoId) {
            setError("Por favor completa todos los campos obligatorios");
            return;
        }

        if (telefono.trim().length < 9) {
            setError("El teléfono debe tener 9 dígitos");
            return;
        }

        if (numeroDoc.trim().length < 8) {
            setError("El número de documento debe tener 8 dígitos");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const dto: PersonaUserDTO = {
                nombre,
                apellidos,
                email,
                telefono,
                fechaNac,
                numeroDoc,
                tipoDocumentoId,
                username,
                password,
                roles: [], // ← vacío para que el backend asigne RESIDENTE por defecto
            };

            await RegisterPersonaService(dto);
            goToLogin();
        } catch (e: any) {
            console.log("REGISTER ERROR =>", e.response?.data || e.message);
            setError(e.response?.data?.message || "Error al registrar usuario");
        } finally {
            setLoading(false);
        }
    };

    return {
        // Campos
        nombre, setNombre,
        apellidos, setApellidos,
        email, setEmail,
        telefono, setTelefono,
        fechaNac, setFechaNac,
        numeroDoc, setNumeroDoc,
        username, setUsername,
        password, setPassword,
        // Combobox
        tipoDocumentos,
        tipoDocumentoId,
        setTipoDocumentoId,
        // Estado
        loading,
        error,
        onSubmit,
    };
};
