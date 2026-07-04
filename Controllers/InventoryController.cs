using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vend_O_Matic.Data;

namespace Vend_O_Matic.Controllers;

[ApiController]
[Route("inventory")]
public class InventoryController : ControllerBase
{
    private readonly VendingDbContext _dbContext;

    public InventoryController(VendingDbContext context)
    {
        _dbContext = context;
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
}
