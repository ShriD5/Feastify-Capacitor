import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";

const useUserRole = () => {
    const [role, setRole] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const userEmail = user.email;
                const roleString = userEmail?.split("@")[0];
                if (roleString === "volunteer") {
                    setRole("volunteer");
                } else if (roleString === "donor") {
                    setRole("donor");
                } else if (roleString === "admin") {
                    setRole("admin");
                }
            }
        });

        return () => unsubscribe();
    }, []);

    return role;
};

export default useUserRole;
