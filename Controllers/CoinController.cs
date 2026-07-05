using Microsoft.AspNetCore.Mvc;
using Vend_O_Matic.Models.DTOs;
using Vend_O_Matic.Services;

namespace Vend_O_Matic.Controllers;

[ApiController]
[Route("/")]
public class CoinController : ControllerBase
{
    private readonly CoinBank _coinBank;

    public CoinController(CoinBank coinBank)
    {
        _coinBank = coinBank;
    }

    [HttpPut]
    public IActionResult InsertCoin(CoinRequestDTO request)
    {
        if (request.Coin != 1)
        {
            return BadRequest();
        }

        _coinBank.AddCoin();
        Response.Headers.Append("X-Coins", _coinBank.GetHeldCount().ToString());
        return NoContent();
    }

    [HttpDelete]
    public IActionResult ReturnCoins()
    {
        var heldCoins = _coinBank.GetHeldCount();
        _coinBank.Reset();
        Response.Headers.Append("X-Coins", heldCoins.ToString());
        return NoContent();
    }
}
