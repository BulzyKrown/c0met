interface CometOptions {
    token?: string
    originalToken?: string
}

interface ColorInfo {
    name: string,
    hex: string,
    rgb: string,
    hsl: string,
    cymk: string,
    similars: string[],
    integer: number,
    negative: string,
    isLight: boolean,
    isDark: boolean,
    example: Buffer
}

interface Lyrics {
    name: string,
    author: string,
    image: string,
    lyric: string,
}

interface DebugInfo {
    ping: boolean,
    query: boolean,
    querymismatch: boolean,
    ipinsrv: boolean,
    cnameinsrv: boolean,
    animatedmotd: boolean,
    cachetime: boolean
}

interface Motd {
    raw: string[],
    clean: string[],
    html: string[]
}

interface PlayersInfo {
    online: number,
    max: number
}

interface McInfo {
    ip: string,
    port: number
    debug: DebugInfo,
    motd?: Motd,
    players?: PlayersInfo,
    version?: string|number,
    online: boolean,
    protocol?: number,
    hostname?: string,
    icon?: string
}

interface PreColorInfo {
    hex: string
}

interface Duration {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
    microseconds: number,
    nanoseconds: number
}

interface VideoInfo {
    title: string,
    description: string,
    views: string|number,
    duration: Duration,
    author: string
}

interface AIResponse {
    text: string
}

interface B64Response {
    response: string
}

interface BinaryResponse {
    response: string
}

interface ZalgoResponse {
    original: string,
    clearned?: string,
    converted?: string
}

interface ZalgoResponse {
    original: string,
    found: string[],
    count: number,
    percent: number
}

interface SWResponse {
    orginal: string,
    found: string[],
    count: number,
    percent: number
}

declare class Comet {
    
    constructor(token: string);
    private options?: CometOptions;
    private dontHandle?: boolean;

    private _request(path: string, query: object, headers: object): Promise<string|object|Buffer>;
    private startAutoCheck(): Promise<void>;
    private forceCheck(): Promise<void>;

    public Token(): Promise<string>;
    public Beautiful(avatar: string): Promise<Buffer>;
    public Amiajoke(avatar: string): Promise<Buffer>;
    public Beautiful2(avatar: string): Promise<Buffer>;
    public Challenger(avatar: string): Promise<Buffer>;
    public Blur(avatar: string, count?: number): Promise<Buffer>;
    public Border(avatar: string, border: string, line?: number): Promise<Buffer>;
    public Concierge(avatar1: string, avatar2: string): Promise<Buffer>;
    public Convolutional(avatar: string, filter: string): Promise<Buffer>;
    public Darling(avatar: string, filter: string): Promise<Buffer>;
    public Ed(avatar1: string, avatar2: string): Promise<Buffer>;
    public Flip(avatar: string): Promise<Buffer>;
    public Glitch(avatar: string): Promise<Buffer>;
    public Grayscale(avatar: string): Promise<Buffer>;
    public Invert_Grayscale(avatar: string): Promise<Buffer>;
    public Not_Stonk(avatar: string): Promise<Buffer>;
    public Invert(avatar: string): Promise<Buffer>;
    public Pencil_Shading(avatar: string): Promise<Buffer>;
    public Peridot(avatar: string): Promise<Buffer>;
    public Pixel(avatar: string): Promise<Buffer>;
    public Rip(avatar: string, name?: string, year?: string): Promise<Buffer>;
    public Sepia(avatar: string): Promise<Buffer>;
    public Screenshot(avatar: string): Promise<Buffer>;
    public Stonk(avatar: string): Promise<Buffer>;
    public Spin(avatar: string): Promise<Buffer>;
    public Tint(avatar: string, color: string|number): Promise<Buffer>;
    public Colorify(avatar: string, threshold1: number, threshold2: number, gradient: boolean, sqrt: boolean, rainbow: boolean, dark: string, blurple: string, white: string): Promise<Buffer>;
    public Triggered(avatar: string): Promise<Buffer>;
    public Delet(avatar: string): Promise<Buffer>;
    public Color(color: string|number): Promise<ColorInfo>;
    public Lyric(song: string): Promise<Lyrics>;
    public McServer(ip: string, port?: number): Promise<McInfo>;
    public PreColor(avatar: string): Promise<PreColorInfo>;
    public YT(id: string): Promise<VideoInfo>;
    public AI(message: string): Promise<AIResponse>;
    public Base64(message: string, decode: boolean): Promise<B64Response>;
    public Binary(message: string, decode: boolean): Promise<BinaryResponse>;
    public Zalgo(message: string): Promise<ZalgoResponse>;
    public SW(message: string): Promise<SWResponse>;

}

export = Comet;