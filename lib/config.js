import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import useSWR from 'swr';
import { useRouter } from 'next/router';

export const ironOptions = {
    cookieName: "checkincookie",
    password: process.env.COOKIE_PASSWORD,
};

export function ApiRoute(handler) {
    return withIronSessionApiRoute(handler, ironOptions);
}

export function SsrRoute(handler) {
    return withIronSessionSsr(handler, ironOptions);
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());
export const getFetch = (url) => {
    return useSWR(url, fetcher)
};

export const redirect = (url) => {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.push(url);
    }
}