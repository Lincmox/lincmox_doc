# Interactive UI Demo

This is a live, interactive simulation of the Lincmox web interface.
You can click on the LEDs or the front strip on the wireframe to change their colors and states, just like you would on the real LincStation N1!

<style>
/* Expand demo page layout */
.toc-sidebar { display: none !important; }
.main-content { margin-right: 0 !important; max-width: none !important; padding-right: 2rem !important; }
.doc-body { max-width: 1400px !important; margin: 0 auto !important; }

/* Browser Window Mockup */
.browser-mockup {
  margin-top: 2rem; 
  border-radius: 8px; 
  overflow: hidden; 
  border: 1px solid var(--color-border); 
  box-shadow: 0 12px 32px rgba(0,0,0,0.15); 
  background: var(--color-bg);
}
.browser-titlebar {
  height: 38px; 
  background: var(--color-bg); 
  display: flex; 
  align-items: center; 
  padding: 0 16px; 
  gap: 8px; 
  border-bottom: 1px solid var(--color-border);
}
[data-theme="dark"] .browser-titlebar { background: #1a1b1e; }
.browser-dot { width: 12px; height: 12px; border-radius: 50%; }
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }
.browser-address {
  flex: 1; 
  text-align: center; 
  font-size: 0.8rem; 
  color: var(--color-text-muted); 
  font-family: monospace;
}
</style>

<div class="browser-mockup">
  <div class="browser-titlebar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
    <div class="browser-address">https://lincmox-n1.local:8080/</div>
  </div>
  <iframe src="assets/demo.html" width="100%" height="850px" style="border: none; display: block;" title="Lincmox Interactive Demo"></iframe>
</div>
