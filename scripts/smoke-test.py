from pathlib import Path
import base64
import tempfile
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

root = Path(__file__).resolve().parents[1]
artifacts = root / 'artifacts'
artifacts.mkdir(exist_ok=True)
options = webdriver.EdgeOptions()
options.add_argument('--headless=new')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1000')
options.add_argument(f'--user-data-dir={tempfile.mkdtemp(prefix="mesa21-edge-")}')
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
service = webdriver.EdgeService(executable_path=str(root / 'artifacts' / 'msedgedriver.exe'))
driver = webdriver.Edge(service=service, options=options)
wait = WebDriverWait(driver, 15)
try:
    driver.get('http://127.0.0.1:4173/')
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.hero-today')))
    assert 'Mesa 21' in driver.title
    assert len(driver.find_elements(By.CSS_SELECTOR, '.nav-link')) == 10
    assert driver.execute_async_script("const done=arguments[0]; navigator.serviceWorker.ready.then(r=>done(Boolean(r.active))).catch(()=>done(false));")
    driver.save_screenshot(str(artifacts / 'desktop-home.png'))

    driver.get('http://127.0.0.1:4173/#/calendario')
    wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, '.day-card')) == 21)
    assert len(driver.find_elements(By.CSS_SELECTOR, '.day-card')) == 21
    pdf = driver.execute_cdp_cmd('Page.printToPDF', {'landscape': True, 'printBackground': True, 'paperWidth': 11.69, 'paperHeight': 8.27, 'marginTop': .25, 'marginBottom': .25, 'marginLeft': .25, 'marginRight': .25})
    pdf_bytes = base64.b64decode(pdf['data'])
    assert len(pdf_bytes) > 100000
    (artifacts / 'calendario-21-dias.pdf').write_bytes(pdf_bytes)

    driver.get('http://127.0.0.1:4173/#/recetas')
    wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, '.recipe-card')) == 58)
    cards = driver.find_elements(By.CSS_SELECTOR, '.recipe-card')
    cards[0].find_element(By.CSS_SELECTOR, '[data-action="recipe-detail"]').click()
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, '#meal-dialog[open]')))
    assert driver.find_element(By.CSS_SELECTOR, '#meal-dialog').text
    driver.find_element(By.CSS_SELECTOR, '#meal-dialog [data-close]').click()

    driver.get('http://127.0.0.1:4173/#/hoy')
    wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, '.today-meal')) == 3)
    assert len(driver.find_elements(By.CSS_SELECTOR, '.today-meal')) == 3
    driver.find_elements(By.CSS_SELECTOR, '.done-button')[0].click()
    saved = driver.execute_script("return JSON.parse(localStorage.getItem('mesa21_state_v1'))")
    assert saved and saved['meal_statuses']

    driver.get('http://127.0.0.1:4173/#/compra')
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.aisle-group')))
    assert driver.find_element(By.CSS_SELECTOR, '.shop-sticky').text
    first_check = driver.find_elements(By.CSS_SELECTOR, '.shopping-check')[0]
    first_check.click()
    saved = driver.execute_script("return JSON.parse(localStorage.getItem('mesa21_state_v1'))")
    assert saved['shopping_checks'] and saved['purchased_items']

    driver.set_window_size(390, 844)
    driver.get('http://127.0.0.1:4173/#/hoy')
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, '.mobile-header')))
    assert driver.execute_script("return Math.round(document.querySelector('main').getBoundingClientRect().left)") == 0
    assert driver.execute_script("return getComputedStyle(document.querySelector('.mobile-header')).position") == 'fixed'
    assert len(driver.find_elements(By.CSS_SELECTOR, '.today-meal')) == 3
    driver.save_screenshot(str(artifacts / 'mobile-today.png'))
    severe = [x for x in driver.get_log('browser') if x['level'] == 'SEVERE' and 'favicon' not in x['message']]
    assert not severe, severe
    print('PASS: 21 días, 58 recetas e imágenes, estado/stock, compra por pasillos, PWA y layout móvil.')
finally:
    driver.quit()
