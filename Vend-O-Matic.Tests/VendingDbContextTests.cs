using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Vend_O_Matic.Data;

namespace Vend_O_Matic.Tests;

public class VendingDbContextTests
{
    [Fact]
    public void Migrate_SeedsThreeBeveragesAtQuantityFive()
    {
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<VendingDbContext>()
            .UseSqlite(connection)
            .Options;

        using var context = new VendingDbContext(options);
        context.Database.Migrate();

        var beverages = context.Beverages.ToList();

        Assert.Equal(3, beverages.Count);
        Assert.All(beverages, beverage => Assert.Equal(5, beverage.Quantity));
        Assert.Contains(beverages, beverage => beverage.Name == "Cherry Coke");
        Assert.Contains(beverages, beverage => beverage.Name == "LaCroix");
        Assert.Contains(beverages, beverage => beverage.Name == "Sprite");
    }
}
