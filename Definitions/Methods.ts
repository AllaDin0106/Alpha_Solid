export type Generic = {
    value?: any,
    onClick?: any,
    ref?: any
};

export const If = (subject, callback) => {
    if (subject) callback(subject);
};

export const Expiration = {

    MakeString: (minutes: number): string => {
        let exp = new Date();
        exp.setTime(exp.getTime() + (minutes * 60 * 1000));
        return exp.toString();
    },

    IsExpired: (time: string): boolean => {
        let exp = Date.parse(time);
        let now = Date.parse(new Date().toString());
        return now > exp;
    }

};

export const ShuffleArray = (collection: Array<any>): Array<any> =>
    [...collection
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)];

export const StringEllipsis = (value: string, startlen: number = 4, endlen: number = 4) => {
    let start = value.substring(0, startlen);
    let end = value.substring(value.length - endlen, value.length);
    return start + '...' + end;
}

export const NumberTo = {

    Millions: (value: number) => (value / 1000000).toFixed(2) + 'm',
    Billions: (value: number) => (value / 1000000000).toFixed(2) + 'B'

}

export const ToClipboard = (value: string) => navigator.clipboard.writeText(value);