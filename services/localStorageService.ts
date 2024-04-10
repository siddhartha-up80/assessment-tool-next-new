export function getLocalStorageItem(key: string): any{
    const item: string | null = window.localStorage.getItem(key);
    if(item) return JSON.parse(item);
    else return null; 
}
export function setLocalStorageItem(key: string, value: any){
    return window.localStorage.setItem(key, JSON.stringify(value))
}