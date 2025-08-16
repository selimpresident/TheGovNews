import SwiftUI
import Capacitor

struct SafeAreaView: UIViewControllerRepresentable {
    var webView: WKWebView
    
    func makeUIViewController(context: Context) -> UIViewController {
        let viewController = UIViewController()
        viewController.view = webView
        return viewController
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // Update if needed
    }
}

// Bridge to JavaScript
@objc(SafeAreaPlugin)
class SafeAreaPlugin: CAPPlugin {
    @objc func getSafeAreaInsets(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self,
                  let viewController = self.bridge?.viewController else {
                call.reject("Unable to get view controller")
                return
            }
            
            let insets = viewController.view.safeAreaInsets
            call.resolve([
                "top": insets.top,
                "bottom": insets.bottom,
                "left": insets.left,
                "right": insets.right
            ])
        }
    }
}