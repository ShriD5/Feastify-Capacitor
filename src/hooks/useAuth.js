import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc,  getDoc} from "firebase/firestore";
import { auth, database } from "../../lib/firebase";

function useAuth() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);

            if (user) {
                const userDocRef = doc(database, "users", user.uid);

                getDoc(userDocRef)
                    .then((doc) => {
                        if (doc.exists()) {
                            console.log(doc.data())
                            setRole(doc.data().role);
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting user role:", error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);
    return { user, role, loading };
}

export default useAuth;
