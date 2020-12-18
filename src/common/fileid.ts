
export function* fileIdGenerator(initial = 0): Generator<number, number, void>{
    while (true) {
        yield initial
        initial = (initial + 1) & 0xffff
    }
}

export const defaultFileIdGenerator = fileIdGenerator()