using Vend_O_Matic.Services;

namespace Vend_O_Matic.Tests;

public class CoinBankTests
{
    [Fact]
    public void AddCoin_IncrementsHeldCount()
    {
        var bank = new CoinBank();

        bank.AddCoin();

        Assert.Equal(1, bank.GetHeldCount());
    }

    [Fact]
    public void Reset_SetsHeldCountBackToZero()
    {
        var bank = new CoinBank();
        bank.AddCoin();

        bank.Reset();

        Assert.Equal(0, bank.GetHeldCount());
    }
}
