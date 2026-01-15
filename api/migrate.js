"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
// Load environment variables
const envPath = path_1.default.join(__dirname, '..', '.env');
if (fs_1.default.existsSync(envPath)) {
    dotenv_1.default.config({ path: envPath });
    console.log('✅ Loaded .env from', envPath);
}
else {
    console.warn('⚠️ .env not found at', envPath);
}
async function run() {
    // Create connection without specifying database (so we can create it first)
    const connection = await promise_1.default.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });
    const migrationsDir = path_1.default.join(__dirname, 'migrations');
    const files = fs_1.default.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
        const sqlContent = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf8');
        console.log('Running', file);
        try {
            // Split SQL by ; and execute each statement separately
            const statements = sqlContent
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            for (const statement of statements) {
                await connection.query(statement);
            }
            console.log('✅ OK', file);
        }
        catch (err) {
            console.error('❌ Failed', file, err);
            process.exit(1);
        }
    }
    console.log('✅ Migrations complete');
    await connection.end();
    process.exit(0);
}
run();
//# sourceMappingURL=migrate.js.map