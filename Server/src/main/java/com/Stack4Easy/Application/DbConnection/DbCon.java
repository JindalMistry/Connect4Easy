package com.Stack4Easy.Application.DbConnection;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class DbCon {
    public static Connection getConnection(String dbName) {
        Connection conn = null;
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            SQLServerDataSource ds = new SQLServerDataSource();
            ds.setUser("sa");
            ds.setPassword("rucha716***");
            ds.setServerName("SERVER\\INNKEYPMS");
            ds.setPortNumber(1433);
            ds.setDatabaseName(dbName);
            ds.setEncrypt("false");
            conn = ds.getConnection();
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
        }
        return conn;
    }
}
