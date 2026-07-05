namespace Vend_O_Matic.Services;

public class CoinBank
{
    private int _heldCoins = 0;

    public void AddCoin()
    {
        _heldCoins++;
    }

    public int GetHeldCount()
    {
        return _heldCoins;
    }

    public void Reset()
    {
        _heldCoins = 0;
    }
}
