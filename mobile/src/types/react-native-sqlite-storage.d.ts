declare module 'react-native-sqlite-storage' {
  export interface DatabaseParams {
    name: string;
    location?: string;
    createFromLocation?: string;
  }

  export interface Transaction {
    executeSql(
      statement: string,
      params?: any[],
      success?: (tx: Transaction, results: ResultSet) => void,
      error?: (tx: Transaction, error: SQLError) => void
    ): void;
  }

  export interface ResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item(index: number): any;
      raw(): any[];
    };
  }

  export interface SQLError {
    code: number;
    message: string;
  }

  export interface Database {
    transaction(
      fn: (tx: Transaction) => void,
      error?: (error: SQLError) => void,
      success?: () => void
    ): void;
    readTransaction(
      fn: (tx: Transaction) => void,
      error?: (error: SQLError) => void,
      success?: () => void
    ): void;
    close(success?: () => void, error?: (error: SQLError) => void): void;
    executeSql(
      statement: string,
      params?: any[],
      success?: (results: ResultSet) => void,
      error?: (error: SQLError) => void
    ): void;
  }

  export interface SQLiteFactory {
    DEBUG(debug: boolean): void;
    enablePromise(enable: boolean): void;
    openDatabase(
      params: DatabaseParams,
      success?: (db: Database) => void,
      error?: (error: SQLError) => void
    ): Promise<Database>;
    deleteDatabase(
      params: DatabaseParams,
      success?: () => void,
      error?: (error: SQLError) => void
    ): Promise<void>;
  }

  const SQLite: SQLiteFactory;
  export default SQLite;
}