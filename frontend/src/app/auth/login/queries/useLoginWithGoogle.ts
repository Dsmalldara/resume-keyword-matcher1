
export const useLoginWithGoogle = () => {
    const start = () => {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        const oauthUrl = `${base.replace(/\/$/, "")}/auth/google`;
        
        // Direct browser navigation - the server will handle the 302 redirect
        window.location.href = oauthUrl;
    };

    return { start };
};
