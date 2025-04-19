export type CountryOption = {
    code: string;
    name: string;
    currency: string;
    flag: string;
};

export type CartItem = {
    id: string;
    quantity: number;
};

export type WishlistItem = {
    id: string;
    dateAdded: Date;
};
