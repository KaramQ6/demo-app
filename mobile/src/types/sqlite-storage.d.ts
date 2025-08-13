declare module 'react-native-sqlite-storage' {
  export interface DatabaseParams {
    name: string;
    version?: string;
    displayName?: string;
    size?: number;
    location?: string;
    createFromLocation?: string;
  }

  export interface Transaction {
    executeSql(
      statement: string,
      params?: any[],
      success?: (transaction: Transaction, resultSet: ResultSet) => void,
      error?: (transaction: Transaction, error: SQLError) => void
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

  export interface SQLiteDatabase {
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

    executeSql(
      statement: string,
      params?: any[]
    ): Promise<[ResultSet]>;

    close(): Promise<void>;
  }

  export function openDatabase(params: DatabaseParams): Promise<SQLiteDatabase>;
  export function deleteDatabase(params: DatabaseParams): Promise<void>;
  export function enablePromise(enable: boolean): void;
  export function DEBUG(debug: boolean): void;
}