using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vend_O_Matic.Data;
using Vend_O_Matic.Services;

namespace Vend_O_Matic.Controllers;

[ApiController]
[Route("inventory")]
public class InventoryController : ControllerBase
{
    private readonly VendingDbContext _dbContext;
    private readonly CoinBank _coinBank;

    public InventoryController(VendingDbContext context, CoinBank coinBank)
    {
        _dbContext = context;
        _coinBank = coinBank;
    }

    [HttpGet]
    public async Task<IActionResult> GetInventory()
    {
        var quantities = await _dbContext.Beverages
            .OrderBy(b => b.Id)
            .Select(b => b.Quantity)
            .ToListAsync();

        return Ok(quantities);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInventoryItem(int id)
    {
        var beverage = await _dbContext.Beverages.FindAsync(id);

        if (beverage == null)
        {
            return NotFound();
        }

        return Ok(beverage.Quantity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PurchaseBeverage(int id)
    {
        var beverage = await _dbContext.Beverages.FindAsync(id);

        if (beverage == null)
        {
            return NotFound();
        }

        var heldCoins = _coinBank.GetHeldCount();

        if (beverage.Quantity == 0)
        {
            _coinBank.Reset();
            Response.Headers.Append("X-Coins", heldCoins.ToString());
            return NotFound();
        }

        if (heldCoins < 2)
        {
            Response.Headers.Append("X-Coins", heldCoins.ToString());
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        beverage.Quantity -= 1;
        await _dbContext.SaveChangesAsync();

        var change = heldCoins - 2;
        _coinBank.Reset();

        Response.Headers.Append("X-Coins", change.ToString());
        Response.Headers.Append("X-Inventory-Remaining", beverage.Quantity.ToString());

        return Ok(new { quantity = 1 });
    }
}
