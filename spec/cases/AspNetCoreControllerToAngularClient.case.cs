public class HomeController {
    public Task<string[]> GetAllUsers(string username, string email) {
        return new [] {
            "foo",
            "bar"
        };
    }

    [HttpPost]
    public bool Login(string username, string password) {
        return true;
    }
}