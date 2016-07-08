using System;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using Dapper.Contrib.Extensions;
using StackExchange.Redis;

namespace ConsoleApplication
{
    public class Program
    {
        private static string connectText = "Data Source=.;Initial Catalog=Repository;User ID=notefirst;Password=1234567a";

        public static void Main(string[] args)
        {
            using (var db = GetOpenConnection())
            {
                db.Execute(@"if OBJECT_ID('TestModels') IS NOT NULL drop table TestModels;");
                db.Execute(@"create table TestModels (Id int identity(1,1) not null, Name varchar(32) not null);");
                db.Insert(new TestModel()
                {
                    Id = 1,
                    Name = "testName"
                });
                string name = db.Get<TestModel>(1).Name;
                Console.WriteLine("Get Name From Database:" + name);                

                ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost");
                IDatabase redisDb = redis.GetDatabase();
                redisDb.StringSet("string1", name);
                Console.WriteLine("Get Name From Redis:" + redisDb.StringGet("string1"));
            }

            Console.WriteLine("Hello World!");
        }

        private static IDbConnection GetOpenConnection()
        {
            var connection = new SqlConnection(connectText);
            connection.Open();
            return connection;
        }
    }

    public class TestModel
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
