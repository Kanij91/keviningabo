from playwright.sync_api import Page, expect, sync_playwright

def verify_user_setup(page: Page):
    # Navigate to the verification page
    page.goto("http://localhost:5173/verify_setup.html")

    # Wait for the form to be visible
    page.wait_for_selector("form")

    # Assert that the Role label is NOT visible
    # We use a try/except block or check for count to confirm absence
    role_label = page.get_by_text("Role", exact=True)
    if role_label.count() > 0:
        # It might be present but hidden, or present as part of another text.
        # Let's be more specific. exact=True helps.
        # But if it's there, we should fail.
        # However, checking visibility is better.
        expect(role_label).not_to_be_visible()

    # Also check that there is no select element (except maybe hidden ones?)
    # The original code had <select className="form-select">
    select = page.locator("select")
    expect(select).not_to_be_visible()

    # Fill in the Name field to make it look "active"
    page.fill("input[type='text']", "Test User")

    # Take a screenshot
    page.screenshot(path="verification/user_setup_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_user_setup(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
