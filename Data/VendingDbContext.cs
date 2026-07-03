using Microsoft.EntityFrameworkCore;
using Vend_O_Matic.Models;

namespace Vend_O_Matic.Data;

public class VendingDbContext : DbContext
{
    public VendingDbContext(DbContextOptions<VendingDbContext> options) : base(options)
    {
    }

    public DbSet<Beverage> Beverages => Set<Beverage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Beverage>().HasData(
            new Beverage { Id = 1, Name = "Cherry Coke", Quantity = 5 },
            new Beverage { Id = 2, Name = "LaCroix", Quantity = 5 },
            new Beverage { Id = 3, Name = "Sprite", Quantity = 5 }
        );
    }
}
